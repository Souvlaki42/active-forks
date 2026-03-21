"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useTransition } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
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

const RepoSearchSchema = z.object({
  repo: z
    .string()
    .includes("/", { message: "Repo must not be empty and include a slash" }),
});

export function RepoSearchForm() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RepoSearchSchema>>({
    resolver: zodResolver(RepoSearchSchema),
    defaultValues: {
      repo: pathname.substring(1),
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof RepoSearchSchema>> = (
    values,
  ) => {
    const formValue = values.repo.trim();
    const defaultValue = form.formState.defaultValues?.repo?.trim() ?? "";
    if (formValue === defaultValue) {
      form.setError("repo", { message: "Already viewing this repository" });
      return;
    }
    startTransition(() => {
      router.push(`/${formValue}?${searchParams.toString()}`);
    });
  };

  return (
    <Form {...form}>
      <FormMessage />
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
              <FormMessage />
              <FormControl>
                <Input
                  placeholder='Find repository (e.g. "techgaun/active-forks")'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="text-secondary h-5 w-5 animate-spin" />
          ) : null}
          Search
        </Button>
      </form>
    </Form>
  );
}
