import ProfileImage from "./ProfileImage";

import Input from "./Input";
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { useProfile } from "../hooks/useProfile";
import { useUpdateUser } from "../hooks/useUpdateUser";
import Button from "./Button";
import { Profile as ProfileType } from "../types/types";
import { useTranslation } from "react-i18next";

type UpdatePayload = {
  username?: string;
  profile?: Partial<ProfileType>;
  [key: string]: unknown;
};

function Profile() {
  const { t } = useTranslation("auth");
  const { profile } = useProfile();
  const { update, isLoading: isUpdating } = useUpdateUser();

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const [usernameInput, setUsernameInput] = useState("");
  const [bioInput, setBioInput] = useState("");

  useEffect(() => {
    if (profile?.user?.username) {
      setUsernameInput(profile.user.username);
    }

    if (profile?.bio) {
      setBioInput(profile.bio);
    }
  }, [profile]);

  function handleReset(context: "username" | "bio") {
    if (context === "bio") {
      setIsEditingBio(false);
      return;
    }
    setIsEditingUsername(false);
  }

  function handleUpdate() {
    const updates: UpdatePayload = {};

    // Only update username if it's not empty and has changed
    if (
      usernameInput.trim() !== "" &&
      usernameInput !== profile?.user?.username
    ) {
      updates.username = usernameInput.trim();
    }

    // Only update bio if it's not empty and has changed
    if (bioInput.trim() !== "" && bioInput !== profile?.bio) {
      updates.profile = {
        bio: bioInput.trim(),
      };
    }

    // If nothing changed or both inputs are empty, exit early
    if (Object.keys(updates).length === 0) return;

    update(updates);

    setIsEditingBio(false);
    setIsEditingUsername(false);
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col flex-1 gap-4">
        <h1 className="px-4 py-6 text-4xl font-semibold">{t("profile")}</h1>
        <div className="flex items-center justify-center gap-4 px-4 py-2">
          <ProfileImage
            context="settings"
            imgSrc={profile?.user?.avatar}
            size="lg"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 px-6 py-4 text-left">
            <label
              htmlFor="username"
              className="text-sm text-[var(--color-brand-100)]"
            >
              {t("username")}
            </label>
            <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
              {!isEditingUsername ? (
                <>
                  <span>{profile?.user?.username}</span>
                  <MdEdit
                    className="text-xl cursor-pointer hover:text-[var(--color-brand-100)]"
                    onClick={() => setIsEditingUsername((x) => !x)}
                  />
                </>
              ) : (
                <>
                  <Input
                    type="text"
                    id="username"
                    className=" bg-none border-b-2 border-[var(--color-brand-100)] focus:outline-none"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    autoFocus
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      icon={
                        <IoMdCheckmark className="text-xl hover:text-green-400" />
                      }
                      size="small"
                      disabled={isUpdating}
                      onClick={handleUpdate}
                    />
                    <Button
                      icon={
                        <IoMdClose
                          className="text-xl hover:text-red-500"
                          onClick={() => handleReset("username")}
                        />
                      }
                      size="small"
                      disabled={isUpdating}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 px-6 py-4 text-left">
            <label
              htmlFor="bio"
              className="text-sm text-[var(--color-brand-100)]"
            >
              {t("bio")}
            </label>
            <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
              {!isEditingBio ? (
                <>
                  <span>{profile?.bio}</span>
                  <MdEdit
                    className="text-xl cursor-pointer hover:text-[var(--color-brand-100)]"
                    onClick={() => setIsEditingBio((x) => !x)}
                  />
                </>
              ) : (
                <>
                  <Input
                    type="text"
                    id="bio"
                    className=" bg-none border-b-2 border-[var(--color-brand-100)] focus:outline-none"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    autoFocus
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      icon={
                        <IoMdCheckmark className="text-xl hover:text-green-400" />
                      }
                      size="small"
                      disabled={isUpdating}
                      onClick={handleUpdate}
                    />
                    <Button
                      icon={
                        <IoMdClose
                          className="text-xl hover:text-red-500"
                          onClick={() => handleReset("bio")}
                        />
                      }
                      size="small"
                      disabled={isUpdating}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
