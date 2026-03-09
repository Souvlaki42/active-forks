import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
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
import { RepoSchema } from "~/lib/github/schema";

const RepoSearchSchema = z.object({
  repo: RepoSchema,
});

type RepoSearch = z.infer<typeof RepoSearchSchema>;

export function RepoSearchForm() {
  const { pathname, searchStr } = useLocation();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RepoSearch> = async ({ repo }) => {
    navigate({
      to: `/${repo.trim()}`,
      search: searchStr,
    });
  };

  const form = useForm({
    resolver: zodResolver(RepoSearchSchema),
    defaultValues: {
      repo: pathname.substring(1),
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit);
        }}
        className="flex items-end space-x-2"
      >
        <FormField
          name="repo"
          render={(field) => (
            <FormItem className="flex-1">
              <FormLabel className="sr-only">Repo to search</FormLabel>
              <FormControl>
                <Input
                  placeholder='Find repository (e.g. "techgaun/active-forks")'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitted || !form.formState.isDirty}
        >
          {form.formState.isSubmitted ? (
            <Loader2 className="text-secondary h-5 w-5 animate-spin" />
          ) : null}
          Search
        </Button>
      </form>
    </Form>
  );
}
