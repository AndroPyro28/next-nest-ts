"use client"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/hooks/useQueryProcessor";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

type Props = {
  params: {
    id: string;
  };
};

const ProfilePage = (props: Props) => {
  const { data } =  useSession()
  const { id: userId } = props.params;

  type UserType = {
    id: number;
    email: string;
    name: string;
  };

  // THIS SHOULD USE SERVER ACTION INSTEAD OF API CALL

  // REACT QUERY RUNS ONLY IN CLIENT SIDE COMPONENT
  const {data: user, isError, isLoading} = query<UserType>(
    `/user/${userId}`,
    ["user", userId],
    {
      enabled: data?.authTokens.accessToken != null // we use this because we want to query it when the accesstoken is not null
    }, 
    {
      authorization: `Bearer ${data?.authTokens.accessToken}`,
    }
  );

  if(isLoading) {
    return <h1>loading...</h1>
  }
  if(isError) {
    return <h1>there is an error</h1>
  }

  return (
    <div className="m-2 border rounded shadow overflow-hidden">
      <div className="p-2 bg-gradient-to-b from-white to-slate-200 text-slate-600 text-center">
        User Profile
      </div>

      <div className="grid grid-cols-2  p-2 gap-2">
        <p className="p-2 text-slate-400">Name:</p>
        <p className="p-2">{user?.name}</p>
        <p className="p-2 text-slate-400">Email:</p>
        <p className="p-2 ">{user?.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
