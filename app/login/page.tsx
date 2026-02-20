import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { readAuthState } from "@/lib/ctf/auth-state";
import { getLoginPage } from "@/lib/ctf/service";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const data = (await readAuthState("login")) ?? (await getLoginPage());

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/login/submit" method="post" className="space-y-4">
            {data.csrfToken ? <input type="hidden" name="_csrf_token" value={data.csrfToken} /> : null}
            {data.alert ? (
              <Alert variant="destructive">
                <AlertTitle>Login failed</AlertTitle>
                <AlertDescription>{data.alert}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="name_or_email">Username or email</Label>
              <Input id="name_or_email" name="name_or_email" defaultValue={data.fieldValues.name_or_email ?? ""} required />
              {data.fieldErrors.name_or_email ? <p className="text-sm text-red-700">{data.fieldErrors.name_or_email}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {data.fieldErrors.password ? <p className="text-sm text-red-700">{data.fieldErrors.password}</p> : null}
            </div>

            <Button className="w-full" type="submit">
              Login
            </Button>

            <p className="text-sm text-slate-600">
              Don&apos;t have an account yet?{" "}
              <Link href="/register" className="font-medium text-slate-900 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
