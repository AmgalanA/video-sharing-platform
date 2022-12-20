import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import { GoVerified } from "react-icons/go";
import NoResults from "../../components/NoResults";
import VideoCard from "../../components/VideoCard";
import useAuthStore from "../../store/authStore";

import { IUser, Video } from "../../types";
import { BASE_URL } from "../../utils";

interface IProps {
  videos: Video[];
}

const Search: FC<IProps> = ({ videos }) => {
  const [isAccounts, setIsAccounts] = useState(false);

  const { allUsers } = useAuthStore();

  const {
    query: { searchTerm },
  }: any = useRouter();

  const accounts = isAccounts ? "border-b-2 border-black" : "text-gray-400";
  const isVideos = !isAccounts ? "border-b-2 border-black" : "text-gray-400";

  const searchedAccounts = allUsers.filter((user: IUser) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
        <p
          onClick={() => setIsAccounts(true)}
          className={`${accounts} text-xl font-semibold cursor-pointer mt-2`}
        >
          Accounts
        </p>
        <p
          onClick={() => setIsAccounts(false)}
          className={`${isVideos} text-xl font-semibold cursor-pointer mt-2`}
        >
          Videos
        </p>
      </div>

      {isAccounts ? (
        <div className="md:mt-16">
          {searchedAccounts.length > 0 ? (
            searchedAccounts.map((user: IUser, index: number) => (
              <Link key={index} href={`/profile/${user._id}`}>
                <div className="flex p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200 gap-3">
                  <div>
                    <Image
                      src={user.image}
                      width={50}
                      height={50}
                      className="rounded-full"
                      alt="user profile"
                    />
                  </div>

                  <div className="">
                    <p className="flex gap-1 items-center text-md font-bold text-primary lowercase">
                      {user.userName.replaceAll(" ", "")}
                      <GoVerified className="text-blue-400" />
                    </p>

                    <p className="capitalize text-xs text-gray-400">
                      {user.userName}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <NoResults text={`No Videos Accounts for ${searchTerm}`} />
          )}
        </div>
      ) : (
        <div className="md:mt-16 flex flex-wrap gap-6 md:justify-start">
          {videos.length ? (
            videos.map((video, index) => <VideoCard post={video} key={index} />)
          ) : (
            <NoResults text={`No Videos Results for ${searchTerm}`} />
          )}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async ({
  params: { searchTerm },
}: {
  params: { searchTerm: string };
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/search/${searchTerm}`);

  return { props: { videos: data } };
};

export default Search;
