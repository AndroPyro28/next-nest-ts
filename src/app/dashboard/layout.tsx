import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import getSession from "../actions/getSession";

type Props = {
  children: React.ReactNode;
};

const DashBoardLayout = async (props: Props) => {
  const session = await getSession()

  return (
    <div className=" grid grid-cols-12">
      <div className="grid-cols-4 border-r shadow h-screen p-2">
        <Link
          className="p-3 rounded hover:bg-emerald-600 hover:text-white hover:shadow transition "
          href={`/dashboard/user/${session?.user.id}`}
        >
          User Profile
        </Link>
      </div>
      <div className="col-span-4">{props.children}</div>
    </div>
  );
};

export default DashBoardLayout;