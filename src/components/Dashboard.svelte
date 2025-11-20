<script>
	import Layout from "./Layout.svelte";
	import CalendarWidget from "./Calendar/CalendarWidget.svelte";
	import QuickTasksPanel from "./QuickTasks/QuickTasksPanel.svelte";
	import ProjectsPanel from "./ProjectsPanel.svelte";

	export let app;
</script>

<Layout>
	<CalendarWidget slot="calendar" />
	<QuickTasksPanel slot="tasks" {app} />
	<ProjectsPanel slot="projects" />
</Layout>

<style>
</style>
