import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/transaction'])

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth()

    if (isProtectedRoute(req)) {

        if (!userId) {
            return Response.redirect(new URL('/sign-in', req.url))
        }

        const role = sessionClaims?.metadata?.role
        console.log(role);
        

        if (role !== "admin") {
            return new Response("Unauthorized", { status: 403 })
        }
    }
})

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}