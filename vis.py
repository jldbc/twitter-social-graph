import networkx as net
from networkx.readwrite import json_graph
import matplotlib.pyplot as plt
import json
from collections import defaultdict
import math

twitter_network = [ line.strip().split('\t') for line in file('twitter_network.csv') ]
o = net.DiGraph()
hfollowers = defaultdict(lambda: 0)
for (twitter_user, followed_by, followers) in twitter_network:
    o.add_edge(twitter_user, followed_by, followers=int(followers))
    hfollowers[twitter_user] = int(followers)

SEED = 'jmzledoux'

# center around the SEED node and set radius of graph
g = net.DiGraph(net.ego_graph(o, SEED, radius=4))

def trim_degrees(g, degree=1):
    g2 = g.copy()
    d = net.degree(g2)
    for n in g2.nodes():
        if n == SEED: continue # don't prune the seed node
        if d[n] <= degree:
            g2.remove_node(n)
    return g2

def trim_edges(g, weight=1):
    g2 = net.DiGraph()
    for f, to, edata in g.edges_iter(data=True):
        if f == SEED or to == SEED: # keep edges that link to the seed node
            g2.add_edge(f, to, edata)
        elif edata['followers'] >= weight:
            g2.add_edge(f, to, edata)
    return g2

print 'g: ', len(g)
core = trim_degrees(g, degree=4)
print 'core after node pruning: ', len(core)
core = trim_edges(core, weight=100000)
print 'core after edge pruning: ', len(core)

nodeset_types = { 'seed': lambda s: s.lower().startswith(SEED), 'Not Seed': lambda s: not s.lower().startswith(SEED) }


nodeset = defaultdict(list)
nodeset = [ n for n in core.nodes_iter()]

pos = net.spring_layout(core)

plt.figure(figsize=(18,18))
plt.axis('off')

# draw nodes
i = 0
alpha = .75
for k in nodeset:
    ns = [ math.log10(hfollowers[n]+1) * 80 for n in nodeset ]
    print k, len(ns)
    net.draw_networkx_nodes(core, pos, nodelist=nodeset, node_size=ns, node_color='green', alpha=alpha)
    i += 1

# draw edges
net.draw_networkx_edges(core, pos, width=0.5, alpha=0.5)

# draw labels
alpha = .75
for k in nodeset:
    x, y = pos[k]
    plt.text(x, y+0.02, s=k, alpha=alpha, horizontalalignment='center', fontsize=9)

#prune nodes with 0 outgoing connections ('balloon' removal)
outdeg = g.out_degree()
to_remove = [n for n in outdeg if outdeg[n] == 0]
g.remove_nodes_from(to_remove)

#create json, re-draw with d3.js
for n in g:
    g.node[n]['name'] = n

d = json_graph.node_link_data(g)
json.dump(d, open('data.json','w'))
print('Wrote node-link JSON data to data.json')

        