import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineCancel } from "react-icons/md";
import { GoVerified } from "react-icons/go";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { BsFillPlayFill } from "react-icons/bs";
import axios from "axios";
import { NextPage } from "next";

import useAuthStore from "../../store/authStore";

import { Video } from "../../types";
import Comments from "../../components/Comments";
import LikeButton from "../../components/LikeButton";

interface IProp {
  postDetails: Video;
}

const Detail: NextPage<IProp> = ({ postDetails }) => {
  const [post, setPost] = useState(postDetails);
  const [playing, setPlaying] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);

  const { userProfile }: { userProfile: any } = useAuthStore();

  const { back } = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);

  const onVideoClick = () => {
    if (playing) {
      videoRef?.current?.pause();

      setPlaying(false);
    } else {
      videoRef?.current?.play();

      setPlaying(true);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/like`,
        {
          userId: userProfile._id,
          postId: post._id,
          like,
        }
      );

      setPost({ ...post, likes: data.likes });
    }
  };

  const addComment = async (e: ChangeEvent) => {
    e.preventDefault();

    if (userProfile && comment) {
      setIsPostingComment(true);

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/${post._id}`,
        { userId: userProfile._id, comment }
      );

      setPost({ ...post, comments: data.comments });
      setComment("");
      setIsPostingComment(false);
    }
  };

  if (!post) return null;

  return (
    <div className="flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap">
      <div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-blurred-img bg-no-repeat bg-cover bg-center">
        <div className="absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
          <p className="cursor-pointer " onClick={() => back()}>
            <MdOutlineCancel className="text-white text-[35px]" />
          </p>
        </div>

        <div className="relative ">
          <div className="lg:h-[100vh] h-[60vh]">
            <video
              ref={videoRef}
              loop
              onClick={onVideoClick}
              src={post.video.asset.url}
              className=" h-full cursor-pointer"
            ></video>
          </div>
          <div className="absolute top-[45%] left-[45%] cursor-pointer">
            {!playing && (
              <button onClick={onVideoClick} className="">
                <BsFillPlayFill className="text-white text-6xl lg:text-8xl" />
              </button>
            )}
          </div>
        </div>

        <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
          {isVideoMuted ? (
            <button onClick={() => setIsVideoMuted(false)}>
              <HiVolumeOff className="text-white text-2xl lg:text-4xl" />
            </button>
          ) : (
            <button>
              <HiVolumeUp
                onClick={() => setIsVideoMuted(true)}
                className="text-white text-2xl lg:text-4xl"
              />
            </button>
          )}
        </div>
      </div>

      <div className="relative w-[1000px]  md:w-[900px] lg:w-[700px]">
        <div className="lg:mt-20 mt-10">
          <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
            <div className="ml-4 md:w-20 md:h-20 w-16 h-16">
              <Link href="/">
                <>
                  <Image
                    width={62}
                    height={62}
                    className="rounded-full"
                    src={post.postedBy.image}
                    alt="profile photo"
                    layout="responsive"
                  />
                </>
              </Link>
            </div>

            <div>
              <Link href="/">
                <div className="flex flex-col mt-3 gap-2">
                  <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                    {post.postedBy.userName}{" "}
                    <GoVerified className="text-blue-400 text-md" />
                  </p>

                  <p className="capitalize text-xs text-gray-500 hidden md:block font-medium">
                    {post.postedBy.userName}
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <p className="px-10 text-md text-gray-600 text-lg">{post.caption}</p>

          <div className="mt-10 px-10">
            {userProfile && (
              <LikeButton
                likes={post.likes}
                handleLike={() => handleLike(true)}
                handleDislike={() => handleLike(false)}
              />
            )}
          </div>

          <Comments
            comment={comment}
            setComment={setComment}
            isPostingComment={isPostingComment}
            comments={post.comments}
            addComment={addComment}
          />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/${id}`
  );

  return { props: { postDetails: data } };
};

export default Detail;
