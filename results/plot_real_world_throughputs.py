#!/usr/bin/python3

import matplotlib.pyplot as plt
import numpy as np

data = {
    "legends": [
        "google.com (542KB)",
        "youtube.com (5.2MB)",
        "facebook.com (400KB)",
        "twitter.com (5.5MB)",
        "instagram.com (2.2MB)"
    ],
    "throughputs":[225, 84.6, 56.8, 29.8, 19.1],
    "times":[
        [537, 550, 592, 622, 629],
        [1403, 1610, 1724, 1870, 2130],
        [701, 783, 803, 890, 920],
        [1530, 1640, 1704, 1820, 1910],
        [904, 1120, 1280, 1780, 1980]
    ]
}

for index in range(0,len(data["legends"])):
    xpoints = np.array(data["throughputs"])
    ypoints = np.array(data["times"][index])
    plt.plot(xpoints, ypoints, marker='o', label=data["legends"][index])
plt.xlabel("Throughput (Mb/s)")
plt.ylabel("Time (ms)")
plt.title("Page Load Time vs Throughput")
plt.legend()
plt.ioff()
plt.savefig('real_world_throughputs.png', bbox_inches='tight')
plt.clf()