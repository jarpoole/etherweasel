#!/usr/bin/python3

import base_layer
import ethernet_layer 
import ip_layer
import tcp_layer
import http_layer
import rtp_layer
import udp_layer
import video_layer
import util

ethernet_layer_instance = ethernet_layer.EthernetLayer()
root.register_child(ethernet_layer_instance)

ipv4_layer_instance = ip_layer.IPv4Layer()
ethernet_layer_instance.register_child(ipv4_layer_instance)

udp_layer_instance = udp_layer.UDPLayer()
ipv4_layer_instance.register_child(udp_layer_instance)

tcp_layer_instance  = tcp_layer.TCPLayer()
ipv4_layer_instance.register_child(tcp_layer_instance)

rtsp_filter_layer_instance = tcp_layer.TCPFilterLayer(554)
rtsp_filter_layer_instance.name = "rtsp_port_filter"
tcp_layer_instance.register_child(rtsp_filter_layer_instance)

rtsp_lbf_layer_instance = util.LineBufferLayer()
rtsp_filter_layer_instance.register_child(rtsp_lbf_layer_instance)

rtsp_layer_instance = rtp_layer.RTSPLayer(debug=True)
rtsp_filter_layer_instance.register_child(rtsp_layer_instance)

video_filter_layer_instance = udp_layer.UDPFilterLayer(51234)
video_filter_layer_instance.name = "video_port_filter"
udp_layer_instance.register_child(video_filter_layer_instance)

video_layer_instance = video_layer.H264NalLayer()
video_filter_layer_instance.register_child(video_layer_instance)

recorder_layer_instance = util.RecorderLayer()
video_layer_instance.register_child(recorder_layer_instance)

ffmpeg_layer_instance = video_layer.FfmpegLayer("sh", "video_loop.sh", "loop:loop.h264")
recorder_layer_instance.register_child(ffmpeg_layer)
