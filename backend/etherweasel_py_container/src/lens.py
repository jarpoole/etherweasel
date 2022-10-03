#!/usr/bin/python3

import sys
from tornado.ioloop import IOLoop

import util
import driver
import shell

import link_layer
import base_layer
import ethernet_layer
import http_layer
import ip_layer
import rtp_layer
import tcp_layer
import udp_layer
import video_layer

if __name__ == "__main__":

    tap = driver.Tap()
    tap.passive()
    root = link_layer.LinkLayer()
    sh = shell.CommandShell(root,tap)

    # If 2 or more arguments are provided then pass them
    # them to the shell as commands. To provide multiple
    # commands then, just pass each command in spaces
    # 
    # Ex: Load and start an attack
    #        python3 lens.py "load byte_replace.py" "driver active"
    if len(sys.argv) >= 2:
        commands = sys.argv[1:]
        for command in commands:
            sh.handle_command(command)

    try:
        IOLoop.instance().start()
    finally:
        pass
        tap.passive()
