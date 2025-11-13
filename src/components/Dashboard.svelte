<script>
	import Layout from "./Layout.svelte";
	import CalendarWidget from "./CalendarWidget.svelte";
	import TasksPanel from "./TasksPanel.svelte";
	import ProjectsPanel from "./ProjectsPanel.svelte";
</script>

<Layout>
	<CalendarWidget slot="calendar" />
	<TasksPanel slot="tasks" />
	<ProjectsPanel slot="projects" />
</Layout>

<style>
</style>
