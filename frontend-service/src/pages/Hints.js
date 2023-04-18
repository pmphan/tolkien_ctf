import { Prism } from '@mantine/prism';
import H1 from "../components/layout/H1"

const nginxConfig = `server {

  listen 80;

  location / {
    root   /usr/share/nginx/html;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  location /images {
    alias /images/;
  }

  error_page   500 502 503 504  /50x.html;

  location = /50x.html {
    root   /usr/share/nginx/html;
  }
}`


export default function Hints() {
  return <>
    <H1 html="Hints" />
    <div className="text-left flex flex-col space-y-4 justify-center mb-2 mt-0 px-4 py-4 dark:bg-gray-900 dark:text-gray-100">
      <h2 className="text-2xl">Flag 0</h2>
      <div className="space-y-2">
        <p className="italic">Can you read the flag file at /run/secrets/flag?</p>
        <p>Here is a snippet of our nginx config. Can you also read the public key at /run/secrets/jwtpublickey?</p>
        <Prism language="clike">{nginxConfig}</Prism>
      </div>
      <h2 className="text-2xl">Flag 1</h2>
      <div className="space-y-2">
        <p className="italic">Can you log in as the administrator with the email adminery@admin.com?</p>
        <p>Our backend decode the JWT token key roughly as followed.</p>
        <Prism language="python">{ `jwt.decode(token, public_key, algorithms=["ES256", "HS256"])` }</Prism>
      </div>
      <h2 className="text-2xl">Flag 2</h2>
      <div className="space-y-2">
        <p className="italic">Can you figure out what template was used to render the result?</p>
        <p>After you have found all the flag, concatenate then into one using the underscore _ character and wrap them inside CTF_SDaT&#123;&#125;.</p>
        <p>For example, if the three flags are CTF_SDaT&#123;flag0&#125;, CTF_SDaT&#123;flag1&#125;, CTF_SDaT&#123;flag2&#125; respectively, the final flag is <strong>CTF_SDaT&#123;flag0_flag1_flag2&#125;</strong>.</p>
      </div>
    </div>
  </>
}
