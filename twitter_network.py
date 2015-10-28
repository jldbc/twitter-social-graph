import glob
import os
import json
import sys
from collections import defaultdict


#CREATES TWITTER_NETWORK.CSV


users = defaultdict(lambda: { 'followers': 0 })

for f in glob.glob('twitter-users/*.json'):
    data = json.load(file(f))
    #data = json.load(file('1000591.json'))
    screen_name = data['screen_name']
    users[screen_name] = { 'followers': data['followers_count'] }

SEED = 'jmzledoux'

def process_follower_list(screen_name, edges=[], depth=0, max_depth=2):
    f = os.path.join('following', screen_name + '.csv')
    if not os.path.exists(f):
        return edges
    followers = [line.strip().split(',') for line in file(f)]
    for follower_data in followers:
        if len(follower_data) < 2:
            continue
        screen_name_2 = follower_data[1]
        # use the number of followers for screen_name as the weight
        weight = users[screen_name]['followers']
        edges.append([screen_name, screen_name_2, weight])
        if depth+1 < max_depth:
            process_follower_list(screen_name_2, edges, depth+1, max_depth)
    return edges

edges = process_follower_list(SEED, max_depth=3)

# fix seed in the middle in the json file, graph runs off of page otherwise 
# json for anchor: {"name": "jmzledoux", "id": "jmzledoux", "x": "700", "y": "200", "fixed": "True"}


with open('twitter_network.csv', 'w') as outf:
    edge_exists = {}
    for edge in edges:
        key = ','.join([str(x) for x in edge])
        if not(key in edge_exists):
            outf.write('%s\t%s\t%d\n' % (edge[0], edge[1], edge[2]))
            edge_exists[key] = True