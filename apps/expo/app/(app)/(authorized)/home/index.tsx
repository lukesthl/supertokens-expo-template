import { useState } from "react";
import { isAxiosError } from "axios";
import { observer } from "mobx-react-lite";
import { Button, Text, YStack } from "tamagui";

import { AuthStore } from "../../../../components/auth/auth.store";
import { Rest } from "../../../../components/clients/rest.client";

const Home = observer(() => {
  const [adminResponse, setAdminResponse] = useState("");
  return (
    <YStack marginTop="$8" space="$3.5" marginHorizontal="$4">
      <Button
        onPress={() => {
          void Rest.client.get("/test").then((res) => {
            console.log(res.data);
          });
        }}
      >
        Call secure api
      </Button>
      <Button
        onPress={() => {
          Rest.client
            .get<string>("/admin")
            .then((res) => {
              setAdminResponse(res.data);
              console.log(res.data);
            })
            .catch((err) => {
              if (isAxiosError(err) && err.response?.data) {
                console.log(err.response.data);
                setAdminResponse(JSON.stringify(err.response.data, null, 4));
              }
            });
        }}
      >
        Are you an admin?
      </Button>
      {adminResponse && <Text>{adminResponse}</Text>}
      <Button
        onPress={() => {
          Rest.client
            .post("/make-me-an-admin")
            .then((res) => {
              console.log(res.data);
              void AuthStore.loadUser();
            })
            .catch((err) => {
              if (isAxiosError(err) && err.response?.data) {
                console.log(err.response.data);
              }
            });
        }}
      >
        Make me an admin
      </Button>
      <Button
        onPress={() => {
          Rest.client
            .delete("/remove-admin")
            .then((res) => {
              console.log(res.data);
              void AuthStore.loadUser();
            })
            .catch((err) => {
              if (isAxiosError(err) && err.response?.data) {
                console.log(err.response.data);
              }
            });
        }}
      >
        Remove admin
      </Button>
      <Text>Current Roles: {JSON.stringify(AuthStore.user.roles)}</Text>
    </YStack>
  );
});
export default Home;
