Attach to the container

```bash
sudo docker container attach alice_dns_instance
```

To query against the bind server

```bash
dig @192.168.0.2 sub1.example.local +noedns
```
