import type { NextPage } from "next";
import axios from "axios";
import { Video } from "../types";
import VideoCard from "../components/VideoCard";
import NoResults from "../components/NoResults";

interface IProps {
  videos: Video[];
}

const Home: NextPage<IProps> = ({ videos }) => {
  return (
    <div className="flex flex-col gap-10 videos h-full">
      {videos.length ? (
        videos.map((video) => <VideoCard post={video} key={video._id} />)
      ) : (
        <NoResults text={"No Videos"} />
      )}
    </div>
  );
};

export const getServerSideProps = async ({
  query: { topic },
}: {
  query: { topic: string };
}) => {
  let data = null;
  if (topic) {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/discover/${topic}`
    );

    data = response.data;
  } else {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/post`
    );

    data = response.data;
  }

  return {
    props: {
      videos: data,
    },
  };
};

export default Home;
