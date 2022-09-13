import subprocess

class Tap:
    def passive(self):
        # Disconnect the tap adapters and the veth inputs
        subprocess.call(["ip","link","set","tap0","nomaster"])
        subprocess.call(["ip","link","set","tap1","nomaster"])

        # Bridge the two veth inputs directly together
        subprocess.call(["ip","link","set","ethlens1","master","br2"])
        subprocess.call(["ip","link","set","ethlens2","master","br2"])

        print("Successfully configured virtual tap to passive mode")

    def active(self):
        # Bridge veth input with a tap adapter
        subprocess.call(["ip","link","set","ethlens1","master","br0"])
        subprocess.call(["ip","link","set","tap0","master","br0"])
        subprocess.call(["ip","link","set","ethlens2","master","br1"])
        subprocess.call(["ip","link","set","tap1","master","br1"])

        # Bring the tap adapters up
        subprocess.call(["ip","link","set","dev","tap0","up"])
        subprocess.call(["ip","link","set","dev","tap1","up"])

        print("Successfully to configure virtual tap to active mode")
