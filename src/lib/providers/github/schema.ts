import { z } from "zod";

const UserSchema = z.object({
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	login: z.string(),
	id: z.number().int(),
	node_id: z.string(),
	avatar_url: z.string().url(),
	gravatar_id: z.string().nullable().optional(),
	url: z.string().url(),
	html_url: z.string().url(),
	followers_url: z.string().url(),
	following_url: z.string(),
	gists_url: z.string(),
	starred_url: z.string(),
	subscriptions_url: z.string().url(),
	organizations_url: z.string().url(),
	repos_url: z.string().url(),
	events_url: z.string(),
	received_events_url: z.string().url(),
	type: z.string(),
	site_admin: z.boolean(),
	starred_at: z.string().optional(),
	user_view_type: z.string().optional(),
});

const CodeOfConductSchema = z.object({
	key: z.string(),
	name: z.string(),
	url: z.string().url(),
	body: z.string(),
	html_url: z.string().url().nullable().optional(),
});

const LicenseSchema = z
	.object({
		key: z.string().optional(),
		name: z.string().optional(),
		spdx_id: z.string().optional(),
		url: z.string().optional(),
		node_id: z.string().optional(),
	})
	.optional()
	.nullable();

const SecurityAndAnalysisStatus = z.enum(["enabled", "disabled"]);

const SecurityAndAnalysisSchema = z
	.object({
		advanced_security: z
			.object({
				status: SecurityAndAnalysisStatus,
			})
			.optional(),
		code_security: z
			.object({
				status: SecurityAndAnalysisStatus,
			})
			.optional(),
		dependabot_security_updates: z
			.object({
				status: SecurityAndAnalysisStatus,
			})
			.optional(),
		secret_scanning: z
			.object({
				status: SecurityAndAnalysisStatus,
			})
			.optional(),
		secret_scanning_push_protection: z
			.object({
				status: SecurityAndAnalysisStatus,
			})
			.optional(),
		secret_scanning_non_provider_patterns: z
			.object({
				status: SecurityAndAnalysisStatus,
			})
			.optional(),
		secret_scanning_ai_detection: z
			.object({
				status: SecurityAndAnalysisStatus,
			})
			.optional(),
	})
	.optional()
	.nullable();

export const APIForkSchema = z.object({
	id: z.number().int(),
	node_id: z.string(),
	name: z.string(),
	full_name: z.string(),
	owner: UserSchema,
	private: z.boolean(),
	html_url: z.string().url(),
	description: z.string().nullable().optional(),
	fork: z.boolean(),
	url: z.string().url(),
	archive_url: z.string(),
	assignees_url: z.string(),
	blobs_url: z.string(),
	branches_url: z.string(),
	collaborators_url: z.string(),
	comments_url: z.string(),
	commits_url: z.string(),
	compare_url: z.string(),
	contents_url: z.string(),
	contributors_url: z.string().url(),
	deployments_url: z.string().url(),
	downloads_url: z.string().url(),
	events_url: z.string().url(),
	forks_url: z.string().url(),
	git_commits_url: z.string(),
	git_refs_url: z.string(),
	git_tags_url: z.string(),
	git_url: z.string().optional(),
	issue_comment_url: z.string(),
	issue_events_url: z.string(),
	issues_url: z.string(),
	keys_url: z.string(),
	labels_url: z.string(),
	languages_url: z.string().url(),
	merges_url: z.string().url(),
	milestones_url: z.string(),
	notifications_url: z.string(),
	pulls_url: z.string(),
	releases_url: z.string(),
	ssh_url: z.string().optional(),
	stargazers_url: z.string().url(),
	statuses_url: z.string(),
	subscribers_url: z.string().url(),
	subscription_url: z.string().url(),
	tags_url: z.string().url(),
	teams_url: z.string().url(),
	trees_url: z.string(),
	clone_url: z.string().optional(),
	mirror_url: z.string().nullable().optional(),
	hooks_url: z.string().url(),
	svn_url: z.string().optional(),
	homepage: z.string().nullable().optional(),
	language: z.string().nullable().optional(),
	forks_count: z.number().optional(),
	stargazers_count: z.number().optional(),
	watchers_count: z.number().optional(),
	size: z.number(),
	default_branch: z.string().optional(),
	open_issues_count: z.number().optional(),
	is_template: z.boolean().optional(),
	topics: z.array(z.string()).optional(),
	has_issues: z.boolean(),
	has_projects: z.boolean(),
	has_wiki: z.boolean(),
	has_pages: z.boolean(),
	has_downloads: z.boolean(),
	has_discussions: z.boolean().optional(),
	archived: z.boolean(),
	disabled: z.boolean(),
	visibility: z.string().optional(),
	pushed_at: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
	permissions: z
		.object({
			admin: z.boolean().optional(),
			maintain: z.boolean().optional(),
			push: z.boolean().optional(),
			triage: z.boolean().optional(),
			pull: z.boolean().optional(),
		})
		.optional(),
	role_name: z.string().optional(),
	temp_clone_token: z.string().optional(),
	delete_branch_on_merge: z.boolean().optional(),
	subscribers_count: z.number().optional(),
	network_count: z.number().optional(),
	code_of_conduct: CodeOfConductSchema.optional(),
	license: LicenseSchema,
	forks: z.number().optional(),
	open_issues: z.number().optional(),
	watchers: z.number().optional(),
	allow_forking: z.boolean().optional(),
	web_commit_signoff_required: z.boolean().optional(),
	security_and_analysis: SecurityAndAnalysisSchema,
});

export const ListOfForksSchema = z.array(APIForkSchema);
