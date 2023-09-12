import middleware, {withAuth} from "next-auth/middleware"

export default withAuth(function middleware(req) {
    const {pathname} = req.nextUrl
    const email = req.nextauth.token?.user.email

    // role based authentication conditional statement
},{

    pages: {
        signIn: '/api/auth/signin',
    },
    callbacks: {
       async authorized({token}) {
        // we can authorize the client here
        // we can call or setup the app here
        return Boolean(token?.user)
        },
        
    }
})

export const config  = {
    matcher: [
        '/dashboard/:path*',
    ]
}