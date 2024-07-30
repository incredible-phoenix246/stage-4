import { auth } from "~/auth";

const page = async () => {
  // getting session for server components got to navbar and see implemtation for client component
  const session = await auth();
  return (
    <div>
      welcome {session?.user.name} email: {session?.user.email}
    </div>
  );
};

export default page;
