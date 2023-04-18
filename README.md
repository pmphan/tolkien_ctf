# Tolkien CTF

*Simple Web Exploitation CTF*

*UMass Amherst COMPSCI 561: System Defense and Test*

## Start the web server

```console
$ ./gen-key.sh
$ docker-compose up -d
```

## Quick solve

```console
$ cd solver
$ python flag0.py -o jwt.pub
$ python flag1.py jwt.pub
$ python flag2.py jwt.pub
```

## Write up

See [write up](./writeup.md).

