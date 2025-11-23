<script>
	import Layout from "./Layout.svelte";
	import CalendarWidget from "./Calendar/CalendarWidget.svelte";
	import FleetingNotesPanel from "./FleetingNotes/FleetingNotesWidget.svelte";
	import ProjectsWidget from "./Projects/ProjectsWidget.svelte";

	export let app;
</script>

<Layout>
	<CalendarWidget slot="calendar" />
	<FleetingNotesPanel slot="fleeting-notes" {app} />
	<ProjectsWidget slot="projects" {app} />
</Layout>

<style>
</style>
