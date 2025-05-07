import { IoMdArrowRoundBack } from "react-icons/io";
import { User } from "../types/types";
import Button from "./Button";
import Input from "./Input";
import ProfileImage from "./ProfileImage";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineDone } from "react-icons/md";
import { useCreateGroup } from "../hooks/useCreateGroup";

type NewGroupPanelFinalProps = {
  onBack: () => void;
  selectedUsers: User[];
  handleUserSelection: (user: User) => void;
  onSuccess: () => void;
};

function NewGroupPanelFinal({
  onBack,
  selectedUsers,
  handleUserSelection,
  onSuccess,
}: NewGroupPanelFinalProps) {
  const { t } = useTranslation("chats");
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { createGroup, isCreatingGroup } = useCreateGroup();

  useEffect(() => {
    return () => {
      if (groupImage?.startsWith("blob:")) {
        URL.revokeObjectURL(groupImage);
      }
    };
  }, [groupImage]);

  function handleGroupImageSelection(file: File) {
    const previewUrl = URL.createObjectURL(file);
    setGroupImage(previewUrl);
    setImageFile(file); // Save file for uploading later
  }

  async function handleSave() {
    if (!groupName || selectedUsers.length === 0) {
      return;
    }
    createGroup(
      {
        name: groupName,
        users: selectedUsers,
        imageFile,
      },
      {
        onSuccess: () => {
          setGroupName("");
          setGroupImage("");
          setImageFile(null);
          onSuccess();
        },
      }
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex items-center gap-2 px-4 py-4">
        <Button
          icon={<IoMdArrowRoundBack />}
          size="large"
          className="!p-2"
          onClick={onBack}
          disabled={isCreatingGroup}
        />
        <h1 className="text-lg font-semibold">{t("groupDetails")}</h1>
      </div>
      <div className="flex items-center justify-center gap-4 px-4 py-2">
        <ProfileImage
          context="group"
          size="lg"
          imgSrc={groupImage}
          setGroupImageFromFile={handleGroupImageSelection}
        />
      </div>
      <div className="flex flex-col gap-4 px-4 py-2">
        <h2 className="text-lg font-semibold">{t("groupName")}</h2>
        <Input
          type="text"
          placeholder={t("enterGroupName")}
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          disabled={isCreatingGroup}
        />
      </div>
      <div>
        <h2 className="px-4 py-2 text-lg font-semibold">{t("groupMembers")}</h2>
        <div className="flex flex-wrap gap-2 px-4">
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 pr-4 py-2 bg-[var(--color-grey-100)] rounded-full"
            >
              <ProfileImage imgSrc={user.avatar} size="xs" />
              <span className="text-sm font-semibold">{user.username}</span>
              <Button
                icon={<IoMdArrowRoundBack />}
                size="small"
                className="!p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserSelection(user);
                }}
                disabled={isCreatingGroup}
              />
            </div>
          ))}
        </div>
      </div>
      {selectedUsers.length > 0 && groupName && (
        <div className="flex items-center justify-center p-6">
          <Button
            icon={<MdOutlineDone />}
            size="large"
            className="!p-2 bg-[var(--color-brand-100)] !rounded-full text-white"
            onClick={handleSave}
            disabled={isCreatingGroup}
          />
        </div>
      )}
    </div>
  );
}

export default NewGroupPanelFinal;
