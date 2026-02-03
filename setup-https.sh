#!/bin/bash
# Generate self-signed SSL certificate for local development

mkdir -p ./certificates

openssl req -x509 -out ./certificates/localhost.crt -keyout ./certificates/localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1,IP:192.168.1.177\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

echo "✅ SSL certificates created in ./certificates/"
echo "📱 Now install localhost.crt on your iPhone:"
echo "   1. Transfer localhost.crt to your iPhone (email, AirDrop, etc.)"
echo "   2. Open the file on iPhone and install the profile"
echo "   3. Go to Settings > General > About > Certificate Trust Settings"
echo "   4. Enable full trust for the certificate"
