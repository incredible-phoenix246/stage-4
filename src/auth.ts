const GOOGLE_SIGN_IN = async (profile: any) => {
  try {
    const { name, email } = profile;
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: "",
          crearedWith: "google",
          isVerified: true,
          emailVerified: new Date(),
        },
      });
    }
    const { password: _, ...rest } = user;
    return {
      user: rest,
    };
  } catch (error: any) {
    return {
      error: error.message || "An unexpected error occurred.",
      success: false,
    };
  }
};
export { GOOGLE_SIGN_IN };
