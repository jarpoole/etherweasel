#!/usr/bin/python3

import base_layer
import ethernet_layer
import ip_layer
import tcp_layer
import http_layer
import util

ethernet_layer_instance = ethernet_layer.EthernetLayer()
root.register_child(ethernet_layer_instance)

ipv4_layer_instance = ip_layer.IPv4Layer()
ethernet_layer_instance.register_child(ipv4_layer_instance)

tcp_layer_instance = tcp_layer.TCPLayer()
ipv4_layer_instance.register_child(tcp_layer_instance)

byte_replace_layer_instance = util.ByteReplaceLayer(b"something",b"another thing",-1)
tcp_layer_instance.register_child(byte_replace_layer_instance)
