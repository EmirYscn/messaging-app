import { useTranslation } from "react-i18next";
import { useState } from "react";

import Searchbar from "./Searchbar";
import Friends from "./Friends";
import SentFriendRequests from "./SentFriendRequests";
import ReceivedFriendRequests from "./ReceivedFriendRequests";

import { useSocketFriends } from "../hooks/useSocketFriends";

function FriendsList() {
  const { t } = useTranslation("common");

  const [searchbarValue, setSearchbarValue] = useState("");

  useSocketFriends();

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col flex-1 gap-4">
        <h1 className="px-4 py-6 text-4xl font-semibold">{t("friends")}</h1>
        <div className="px-4 ">
          <Searchbar
            placeholder={t("searchFriends")}
            searchValue={searchbarValue}
            setSearchValue={setSearchbarValue}
          />
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto">
          <ReceivedFriendRequests searchbarValue={searchbarValue} />

          <SentFriendRequests searchbarValue={searchbarValue} />

          <Friends searchbarValue={searchbarValue} />
        </div>
      </div>
    </div>
  );
}

export default FriendsList;
