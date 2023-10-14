import SuperTokens from "supertokens-react-native";
import { Rest } from "./components/clients/rest.client";

SuperTokens.init({
  apiDomain: Rest.API_URL,
  apiBasePath: "/auth",
});
