import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { readAuthState } from "@/lib/ctf/auth-state";
import { getRegisterPage } from "@/lib/ctf/service";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const data = (await readAuthState("register")) ?? (await getRegisterPage());

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/register/submit" method="post" className="space-y-4">
            {data.csrfToken ? <input type="hidden" name="_csrf_token" value={data.csrfToken} /> : null}
            {data.alert ? (
              <Alert variant="destructive">
                <AlertTitle>Registration failed</AlertTitle>
                <AlertDescription>{data.alert}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="name">Username</Label>
              <Input id="name" name="name" defaultValue={data.fieldValues.name ?? ""} required />
              {data.fieldErrors.name ? <p className="text-sm text-destructive">{data.fieldErrors.name}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={data.fieldValues.email ?? ""} required />
              {data.fieldErrors.email ? <p className="text-sm text-destructive">{data.fieldErrors.email}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {data.fieldErrors.password ? <p className="text-sm text-destructive">{data.fieldErrors.password}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_again">Confirm password</Label>
              <Input id="password_again" name="password_again" type="password" required />
              {data.fieldErrors.password_again ? <p className="text-sm text-destructive">{data.fieldErrors.password_again}</p> : null}
            </div>

            <Button className="w-full" type="submit">
              Register
            </Button>

            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-foreground hover:underline">
                Login
              </Link>
              {" · "}
              <Link href="/" className="font-medium text-foreground hover:underline">
                Home
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
