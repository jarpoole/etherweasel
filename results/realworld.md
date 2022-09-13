## Real world iperf data

Generated against a Serverius datacenter in the Netherlands.
`iperf3 -c speedtest.serverius.net -J -p 5002`

Error rate was 1.0932 retransmits/MB

```json
{
        "start":        {
                "connected":    [{
                                "socket":       5,
                                "local_host":   "192.168.1.105",
                                "local_port":   34050,
                                "remote_host":  "178.21.16.76",
                                "remote_port":  5002
                        }],
                "version":      "iperf 3.6",
                "system_info":  "Linux WebServer 4.19.0-20-amd64 #1 SMP Debian 4.19.235-1 (2022-03-17) x86_64",
                "timestamp":    {
                        "time": "Mon, 04 Apr 2022 02:37:53 GMT",
                        "timesecs":     1649039873
                },
                "connecting_to":        {
                        "host": "speedtest.serverius.net",
                        "port": 5002
                },
                "cookie":       "2rwrdl6fxsc4gjad6zavo6qcrvtocc3pzbvm",
                "tcp_mss_default":      1440,
                "sock_bufsize": 0,
                "sndbuf_actual":        16384,
                "rcvbuf_actual":        131072,
                "test_start":   {
                        "protocol":     "TCP",
                        "num_streams":  1,
                        "blksize":      131072,
                        "omit": 0,
                        "duration":     10,
                        "bytes":        0,
                        "blocks":       0,
                        "reverse":      0,
                        "tos":  0
                }
        },
        "intervals":    [{
                        "streams":      [{
                                        "socket":       5,
                                        "start":        0,
                                        "end":  1.0000660419464111,
                                        "seconds":      1.0000660419464111,
                                        "bytes":        1745280,
                                        "bits_per_second":      13961317.967386968,
                                        "retransmits":  0,
                                        "snd_cwnd":     217440,
                                        "rtt":  154202,
                                        "rttvar":       976,
                                        "pmtu": 1500,
                                        "omitted":      false
                                }],
                        "sum":  {
                                "start":        0,
                                "end":  1.0000660419464111,
                                "seconds":      1.0000660419464111,
                                "bytes":        1745280,
                                "bits_per_second":      13961317.967386968,
                                "retransmits":  0,
                                "omitted":      false
                        }
                }, {
                        "streams":      [{
                                        "socket":       5,
                                        "start":        1.0000660419464111,
                                        "end":  2.0001311302185059,
                                        "seconds":      1.0000650882720947,
                                        "bytes":        1584000,
                                        "bits_per_second":      12671175.255097236,
                                        "retransmits":  0,
                                        "snd_cwnd":     283680,
                                        "rtt":  203608,
                                        "rttvar":       1309,
                                        "pmtu": 1500,
                                        "omitted":      false
                                }],
                        "sum":  {
                                "start":        1.0000660419464111,
                                "end":  2.0001311302185059,
                                "seconds":      1.0000650882720947,
                                "bytes":        1584000,
                                "bits_per_second":      12671175.255097236,
                                "retransmits":  0,
                                "omitted":      false
                        }
                }, {
                        "streams":      [{
                                        "socket":       5,
                                        "start":        2.0001311302185059,
                                        "end":  3.0001630783081055,
                                        "seconds":      1.0000319480895996,
                                        "bytes":        1330560,
                                        "bits_per_second":      10644139.940063484,
                                        "retransmits":  11,
                                        "snd_cwnd":     226080,
                                        "rtt":  165372,
                                        "rttvar":       256,
                                        "pmtu": 1500,
                                        "omitted":      false
                                }],
                        "sum":  {
                                "start":        2.0001311302185059,
                                "end":  3.0001630783081055,
                                "seconds":      1.0000319480895996,
                                "bytes":        1330560,
                                "bits_per_second":      10644139.940063484,
                                "retransmits":  11,
                                "omitted":      false
                        }
                }, {
                        "streams":      [{
                                        "socket":       5,
                                        "start":        3.0001630783081055,
                                        "end":  4.0003170967102051,
                                        "seconds":      1.0001540184020996,
                                        "bytes":        1267200,
                                        "bits_per_second":      10136038.863490626,
                                        "retransmits":  0,
                                        "snd_cwnd":     266400,
                                        "rtt":  197435,
                                        "rttvar":       2010,
                                        "pmtu": 1500,
                                        "omitted":      false
                                }],
                        "sum":  {
                                "start":        3.0001630783081055,
                                "end":  4.0003170967102051,
                                "seconds":      1.0001540184020996,
                                "bytes":        1267200,
                                "bits_per_second":      10136038.863490626,
                                "retransmits":  0,
                                "omitted":      false
                        }
                }, {
                        "streams":      [{
                                        "socket":       5,
                                        "start":        4.0003170967102051,
                                        "end":  5.00037407875061,
                                        "seconds":      1.0000569820404053,
                                        "bytes":        1267200,
                                        "bits_per_second":      10137022.371781621,
                                        "retransmits":  0,
                                        "snd_cwnd":     293760,
                                        "rtt":  215990,
                                        "rttvar":       219,
                                        "pmtu": 1500,
                                        "omitted":      false
                                }],
                        "sum":  {
                                "start":        4.0003170967102051,
                                "end":  5.00037407875061,
                                "seconds":      1.0000569820404053,
                                "bytes":        1267200,
                                "bits_per_second":      10137022.371781621,
                                "retransmits":  0,
                                "omitted":      false
                        }
                }, {
                        "streams":      [{
                                        "socket":       5,
                                        "start":        5.00037407875061,
                                        "end":  6.00031304359436,
                                        "seconds":      0.99993896484375,
                                        "bytes":        1457280,
                                        "bits_per_second":      11658951.605932979,
                                        "retransmits":  4,
                                        "snd_cwnd":     224640,
                                        "rtt":  176746,
                                        "rttvar":       628,
                                        "pmtu": 1500,
                                        "omitted":      false
                                }],
                        "sum":  {
                                "start":        5.00037407875061,
                                "end":  6.00031304359436,
                                "seconds":      0.99993896484375,
                                "bytes":        1457280,
                                "bits_per_second":      11658951.605932979,
                                "retransmits":  4,
                                "omitted":      false
                        }
                }, {
                        "streams":      [{
                                        "socket":       5,
                                        "start":        6.00031304359436,
                                        "end":  7.0003280639648438,
                                        "seconds":      1.0000150203704834,
                                        "bytes":        1267200,
                                        "bits_per_second":      10137447.731779313,
                                        "retransmits":  0,
                                        "snd_cwnd":     241920,
                                        "rtt":  180412,
                                        "rttvar":       374,
                                        "pmtu": 1500,
                                        "omitted":      false
                                }],
                        "sum":  {
                                "start":        6.00031304359436,
                                "end":  7.0003280639648438,
                                "seconds":      1.0000150203704834,
                                "bytes":        1267200,
                                "bits_per_second":      10137447.731779313,
                                "retransmits":  0,
                                "omitted":      false
                        }
                }, {
                        "streams":      [{
                                        "socket":       5,
                                        "start":        7.0003280639648438,
                                        "end":  8.00032901763916,
                                        "seconds":      1.0000009536743164,
                                        "bytes":        1267200,
                                        "bits_per_second":      10137590.33204047,
                                        "retransmits":  0,
                                        "snd_cwnd":     249120,
                                        "rtt":  187706,
                                        "rttvar":       412,
                                        "pmtu": 1500,
                                        "omitted":      false
                                }],
                        "sum":  {
                                "start":        7.0003280639648438,
                                "end":  8.00032901763916,
                                "seconds":      1.0000009536743164,
                                "bytes":        1267200,
                                "bits_per_second":      10137590.33204047,
                                "retransmits":  0,
                                "omitted":      false
                        }
                }, {
                        "streams":      [{
                                        "socket":       5,
                                        "start":        8.00032901763916,
                                        "end":  9.0000650882720947,
                                        "seconds":      0.99973607063293457,
                                        "bytes":        1267200,
                                        "bits_per_second":      10140276.316710139,
                                        "retransmits":  0,
                                        "snd_cwnd":     250560,
                                        "rtt":  187625,
                                        "rttvar":       189,
                                        "pmtu": 1500,
                                        "omitted":      false
                                }],
                        "sum":  {
                                "start":        8.00032901763916,
                                "end":  9.0000650882720947,
                                "seconds":      0.99973607063293457,
                                "bytes":        1267200,
                                "bits_per_second":      10140276.316710139,
                                "retransmits":  0,
                                "omitted":      false
                        }
                }, {
                        "streams":      [{
                                        "socket":       5,
                                        "start":        9.0000650882720947,
                                        "end":  10.000420093536377,
                                        "seconds":      1.0003550052642822,
                                        "bytes":        1267200,
                                        "bits_per_second":      10134002.37580834,
                                        "retransmits":  0,
                                        "snd_cwnd":     250560,
                                        "rtt":  189653,
                                        "rttvar":       304,
                                        "pmtu": 1500,
                                        "omitted":      false
                                }],
                        "sum":  {
                                "start":        9.0000650882720947,
                                "end":  10.000420093536377,
                                "seconds":      1.0003550052642822,
                                "bytes":        1267200,
                                "bits_per_second":      10134002.37580834,
                                "retransmits":  0,
                                "omitted":      false
                        }
                }],
        "end":  {
                "streams":      [{
                                "sender":       {
                                        "socket":       5,
                                        "start":        0,
                                        "end":  10.000420093536377,
                                        "seconds":      10.000420093536377,
                                        "bytes":        13720320,
                                        "bits_per_second":      10975794.913950006,
                                        "retransmits":  15,
                                        "max_snd_cwnd": 293760,
                                        "max_rtt":      215990,
                                        "min_rtt":      154202,
                                        "mean_rtt":     185874
                                },
                                "receiver":     {
                                        "socket":       5,
                                        "start":        0,
                                        "end":  10.000420093536377,
                                        "seconds":      10.000420093536377,
                                        "bytes":        12612960,
                                        "bits_per_second":      10089944.127968943
                                }
                        }],
                "sum_sent":     {
                        "start":        0,
                        "end":  10.000420093536377,
                        "seconds":      10.000420093536377,
                        "bytes":        13720320,
                        "bits_per_second":      10975794.913950006,
                        "retransmits":  15
                },
                "sum_received": {
                        "start":        0,
                        "end":  10.000420093536377,
                        "seconds":      10.000420093536377,
                        "bytes":        12612960,
                        "bits_per_second":      10089944.127968943
                },
                "cpu_utilization_percent":      {
                        "host_total":   2.2332888821863865,
                        "host_user":    0.53592720178617925,
                        "host_system":  1.6973522667731535,
                        "remote_total": 1.859363,
                        "remote_user":  0.114063,
                        "remote_system":        1.723216
                },
                "sender_tcp_congestion":        "cubic",
                "receiver_tcp_congestion":      "cubic"
        }
}
```