import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RepoSchema } from "~/lib/github/schema";

const RepoSearchSchema = z.object({
  repo: RepoSchema,
});

export function RepoSearchForm() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm({
    validators: {
      onSubmit: RepoSearchSchema,
    },
    defaultValues: {
      repo: pathname.substring(1),
    },
    onSubmit: async (values) => {
      router.push(`/${values.repo.trim()}?${searchParams.toString()}`);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
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
