#!/usr/bin/python3

import base_layer
import ethernet_layer
import ip_layer
import tcp_layer
import util

ethernet_layer_instance = ethernet_layer.EthernetLayer()
root.register_child(ethernet_layer_instance)

ipv4_layer_instance = ip_layer.IPv4Layer()
ethernet_layer_instance.register_child(ipv4_layer_instance)
