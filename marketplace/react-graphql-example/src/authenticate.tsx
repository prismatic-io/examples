import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import prismatic from "@prismatic-io/embedded";
import jsrsasign from "jsrsasign";

/* Authenticating client-side is a bad security practice, and is done 
  for demonstration purposes only. */
interface AuthenticateProps {
  signingKey: string;
  prismaticUrl: string;
  customerExternalId: string;
  orgId: string;
  userId: string;
  setJwt: Function;
  setShowAuthDetails: Function;
}

const authenticate = async ({
  signingKey,
  prismaticUrl,
  customerExternalId,
  orgId,
  userId,
  setJwt,
  setShowAuthDetails,
}: AuthenticateProps) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const privateKey = jsrsasign.KEYUTIL.getKey(signingKey) as jsrsasign.RSAKey;
  const headers = { alg: "RS256" };
  const payload = {
    sub: userId,
    external_id: userId,
    name: "Test User",
    organization: orgId,
    customer: customerExternalId,
    iat: currentTime,
    exp: currentTime + 60 * 60, // 1 hour from now
  };
  const jwt = jsrsasign.KJUR.jws.JWS.sign(
    "RS256",
    JSON.stringify(headers),
    JSON.stringify(payload),
    privateKey
  );

  prismatic.init({ prismaticUrl });
  prismatic.authenticate({ token: jwt });
  setJwt(jwt);
  setShowAuthDetails(false);
};

function Authenticate() {
  const [prismaticUrl, setPrismaticUrl] = useState<string>(
    window.localStorage.getItem("prismaticUrl") || "https://app.prismatic.io"
  );
  const [customerExternalId, setCustomerExternalId] = useState<string>(
    window.localStorage.getItem("customerExternalId") || ""
  );
  const [signingKey, setSigningKey] = useState<string>(
    window.localStorage.getItem("signingKey") || ""
  );
  const [userId, setUserId] = useState<string>(
    window.localStorage.getItem("userId") || ""
  );
  const [orgId, setOrgId] = useState<string>(
    window.localStorage.getItem("orgId") || ""
  );
  const [jwt, setJwt] = useState<string>("");
  const [showAuthDetails, setShowAuthDetails] = useState<boolean>(true);

  useEffect(() => {
    window.localStorage.setItem("prismaticUrl", prismaticUrl);
    window.localStorage.setItem("customerExternalId", customerExternalId);
    window.localStorage.setItem("signingKey", signingKey);
    window.localStorage.setItem("userId", userId);
    window.localStorage.setItem("orgId", orgId);
  }, [prismaticUrl, customerExternalId, signingKey, userId, orgId]);

  return (
    <Accordion
      expanded={showAuthDetails}
      onChange={() => setShowAuthDetails(!showAuthDetails)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Auth Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="h6" gutterBottom>
          User / Connection Info
        </Typography>
        <Typography variant="body1" gutterBottom>
          This section mimics allows you to sign a JWT from the client. In
          production, please sign JWTs from your backend (so clients do not have
          access to your private signing key). Please see{" "}
          <a href="https://prismatic.io/docs/embedding-marketplace/#create-and-sign-a-jwt">
            docs
          </a>
          .
        </Typography>
        <hr />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              id="prismaticUrl"
              name="prismaticUrl"
              label="Prismatic URL"
              fullWidth
              variant="standard"
              value={prismaticUrl}
              onChange={(event) => setPrismaticUrl(event.target.value)}
            />
            <TextField
              required
              id="customerExternalId"
              name="customerExternalId"
              label="Customer External ID"
              fullWidth
              variant="standard"
              value={customerExternalId}
              onChange={(event) => setCustomerExternalId(event.target.value)}
            />
            <TextField
              required
              id="userId"
              name="userId"
              label="User ID"
              fullWidth
              variant="standard"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
            />
            <TextField
              required
              id="orgId"
              name="orgId"
              label="Organization ID"
              fullWidth
              variant="standard"
              value={orgId}
              onChange={(event) => setOrgId(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              id="signingKey"
              name="signingKey"
              label="Signing Key"
              fullWidth
              variant="standard"
              multiline={true}
              rows={4}
              value={signingKey}
              onChange={(event) => setSigningKey(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              onClick={async () =>
                await authenticate({
                  signingKey,
                  prismaticUrl,
                  customerExternalId,
                  userId,
                  orgId,
                  setJwt,
                  setShowAuthDetails,
                })
              }
            >
              Generate JWT
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            Current JWT: <p>{jwt}</p>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default Authenticate;