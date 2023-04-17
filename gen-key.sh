mkdir -p secret
openssl ecparam -genkey -name prime256v1 -noout -out secret/jwt.key
openssl ec -in secret/jwt.key -pubout > secret/jwt-pub.pub
ssh-keygen -y -f secret/jwt.key > secret/jwt.pub
echo "CTF_SDaT{N91nx_41145}" > secret/flag
