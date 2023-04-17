import H1 from "../components/layout/H1"

export default function Hints() {
  return <>
    <H1 html="Hints" />
    <p>Flag 0</p>
    <p>"Our nginx config file is formatted as below. Can you read the JWT public file at /run/secrets/jwtpublickey?"</p>
    <p>NGINXXXX</p>
    <p>Flag 1</p>
    <p>Our backend validate the JWT token key as followed. Can you trick it into thinking it has received an admin token (whose email happens to be adminery@admin.com)?</p>
    <p>Flag 2</p>
    <p>Can you figure out what template was used to render the result?</p>
    <p>After you have found all the flag, concatenate then into one using the underscore _ character and wrap them inside CTF_SDaT{}</p>
    <p>"For example, if the three flags are CTF_SDaT&#123;flag0&#125;, CTF_SDaT&#123;flag1&#125;, CTF_SDaT&#123;flag2&#125; respectively, the final flag is CTF_SDaT&#123;flag0_flag1_flag2&#125;"</p>
  </>
}
