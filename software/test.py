#!/usr/bin/python3

import matplotlib.pyplot as plt
import numpy as np
import json
import subprocess
import click

cpu_limits = [0.25,0.5,0.75,1,1.25,1.5,1.75,2]
lens_configurations = [
    ("--passive", "Passive Mode"),
    ("--active", "No Decode"),
    ("--active --layer=2", "Layer 2 Decode"),
    ("--active --layer=3", "Layer 3 Decode"),
    ("--active --layer=4", "Layer 4 Decode"),
    ("--active --layer=7", "Layer 7 Decode"),
]

@click.command()
@click.option('--load', '-l', is_flag=True, help='Load the results from a temp file in the same directory and plot')
@click.option('--save', '-s', is_flag=True, help='Run tests and save results to temp file in the same directory')
@click.option('--verbose', '-v', is_flag=True, help='Print stdout and stderr from testharness')
def run(load,save,verbose):
    if verbose:
        capture_mode = subprocess.PIPE
    else:
        capture_mode = subprocess.DEVNULL

    if save:
        click.echo("Running tests and saving results...")
        data = {
            "throughputs": [],         # In Mb/s
            "min_rtts": [],            # In ms
            "avg_rtts": [],            # In ms
            "max_rtts": [],            # In ms
            "avg_retransmissions": [], # In retransmit/Mb
        }
        for index in range(0,len(lens_configurations)):
            data["throughputs"].append([])
            data["min_rtts"].append([])
            data["avg_rtts"].append([])
            data["max_rtts"].append([])
            data["avg_retransmissions"].append([])
            for cpu_limit in cpu_limits:
                # Run test
                print("Testing " + str(lens_configurations[index][1]) + " throughput with " + str(cpu_limit) + "CPUs")
                subprocess.run(["./testharness.sh","iperf","--cpus=" + str(cpu_limit), *lens_configurations[index][0].split()], stderr=capture_mode, stdout=capture_mode, check=True) 
                
                # Get results
                raw = open('./iperf_container/shared/results.json')
                parsed = json.load(raw)

                # Save results
                data["throughputs"][index].append(parsed["end"]["sum_received"]["bits_per_second"] / 1000000)
                data["min_rtts"][index].append(parsed["end"]["streams"][0]["sender"]["min_rtt"] / 1000)
                data["avg_rtts"][index].append(parsed["end"]["streams"][0]["sender"]["mean_rtt"] / 1000)
                data["max_rtts"][index].append(parsed["end"]["streams"][0]["sender"]["max_rtt"] / 1000)
                data["avg_retransmissions"][index].append(parsed["end"]["streams"][0]["sender"]["retransmits"] / (parsed["end"]["streams"][0]["sender"]["bytes"] / 1000000))

        with open("results/data.tmp", "w+") as f:
            f.write(str(data))

    if load:
        click.echo("Loading results and plotting...")
        with open("results/data.tmp", "r") as f:
            data = eval(f.read())

        for index in range(1,len(lens_configurations)):
            xpoints = np.array(cpu_limits)
            ypoints = np.array(data["throughputs"][index])
            plt.plot(xpoints, ypoints,marker='o',label=lens_configurations[index][1])
        plt.xlabel("Number of CPUs")
        plt.ylabel("Throughput (Mb/s)")
        plt.title("Active Mode Throughput vs CPU Count at Various Decode Complexities")
        plt.legend()
        plt.ioff()
        plt.savefig('results/active_mode_throughputs.png', bbox_inches='tight')
        plt.clf()

        bars = plt.bar(["Passive","Active"],[data["throughputs"][0][cpu_limits.index(1)],data["throughputs"][1][cpu_limits.index(1)]])
        plt.bar_label(bars)
        plt.xlabel("Mode")
        plt.ylabel("Throughput (Mb/s)")
        plt.title("Active vs Passive Mode Throughput")
        plt.ioff()
        plt.savefig('results/active_vs_passive_throughputs.png', bbox_inches='tight')
        plt.clf()

        groups = 2
        index = np.arange(groups)
        bar_width = 0.3
        fig, ax = plt.subplots()
        bars1 = ax.bar(index, [data["min_rtts"][0][cpu_limits.index(1)],data["min_rtts"][1][cpu_limits.index(1)]], bar_width, label="Minimum")
        bars2 = ax.bar(index+bar_width, [data["avg_rtts"][0][cpu_limits.index(1)],data["avg_rtts"][1][cpu_limits.index(1)]], bar_width, label="Average")
        bars3 = ax.bar(index+2*bar_width, [data["max_rtts"][0][cpu_limits.index(1)],data["max_rtts"][1][cpu_limits.index(1)]], bar_width, label="Maximum")
        ax.bar_label(bars1)
        ax.bar_label(bars2)
        ax.bar_label(bars3)
        plt.xlabel("Mode")
        ax.set_xticks(index + bar_width)
        ax.set_xticklabels(("Passive","Active"))
        plt.ylabel("Round Trip Time (ms)")
        plt.title("Active vs Passive Mode Round Trip Time")
        plt.legend()
        plt.ioff()
        plt.savefig('results/active_vs_passive_rtt.png', bbox_inches='tight')
        plt.clf()

        bars = plt.bar(["Passive","Active","Internet (Control)"],[data["avg_retransmissions"][0][cpu_limits.index(1)],data["avg_retransmissions"][1][cpu_limits.index(1)],1.0932])
        plt.bar_label(bars)
        plt.xlabel("Mode")
        plt.ylabel("Number of Retransmissions (retransmits/MB)")
        plt.title("Active vs Passive Mode Normalized Error Rate")
        plt.ioff()
        plt.savefig('results/active_vs_passive_norm_error_rate.png', bbox_inches='tight')
        plt.clf()

if __name__ == '__main__':
    run()
