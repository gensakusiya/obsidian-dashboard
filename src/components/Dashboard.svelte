<script>
	import Layout from "./Layout.svelte";
	import CalendarWidget from "./Calendar/CalendarWidget.svelte";
	import FleetingNotesPanel from "./FleetingNotes/FleetingNotesPanel.svelte";
	import ProjectsPanel from "./ProjectsPanel.svelte";

	export let app;
</script>

<Layout>
	<CalendarWidget slot="calendar" />
	<FleetingNotesPanel slot="fleeting-notes" {app} />
	<ProjectsPanel slot="projects" />
</Layout>

<style>
</style>
