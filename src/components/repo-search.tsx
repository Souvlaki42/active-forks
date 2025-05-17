"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RepoSearchSchema } from "~/lib/providers/github/schema";

export function RepoSearchForm() {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<z.infer<typeof RepoSearchSchema>>({
    resolver: zodResolver(RepoSearchSchema),
    defaultValues: {
      repo: pathname.substring(1),
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof RepoSearchSchema>> = (
    values
  ) => {
    router.push(`/${values.repo}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end space-x-2"
      >
        <FormField
          control={form.control}
          name="repo"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="sr-only">Repo to search</FormLabel>
              <FormControl>
                <Input placeholder="techgaun/active-forks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitted}>
          {form.formState.isSubmitted ? (
            <Loader2 className="text-secondary h-5 w-5 animate-spin" />
          ) : null}
          Search
        </Button>
      </form>
    </Form>
  );
}
