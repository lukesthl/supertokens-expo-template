import { observer } from "mobx-react-lite";
import { Button, Text, View, YStack } from "tamagui";
import { Rest } from "../../../../components/clients/rest.client";
import { AuthStore } from "../../../../components/auth/auth.store";
import { useState } from "react";

const Home = observer(() => {
  const [adminResponse, setAdminResponse] = useState("");
  return (
    <YStack mt="$8" space="$3.5" mx="$4">
      <Button
        onPress={() => {
          Rest.client.get("/test").then((res) => {
            console.log(res.data);
          });
        }}
      >
        Call secure api
      </Button>
      <Button
        onPress={() => {
          Rest.client
            .get("/admin")
            .then((res) => {
              setAdminResponse(res.data);
              console.log(res.data);
            })
            .catch((err) => {
              console.log(err.response.data);
              setAdminResponse(JSON.stringify(err.response.data, null, 4));
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
              AuthStore.loadUser();
            })
            .catch((err) => {
              console.log(err.response.data);
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
              AuthStore.loadUser();
            })
            .catch((err) => {
              console.log(err.response.data);
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
