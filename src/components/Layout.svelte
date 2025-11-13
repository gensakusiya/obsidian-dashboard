<div class="layout">
	<slot name="calendar"></slot>
	<slot name="projects"></slot>
	<slot name="tasks"></slot>
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: 1fr 2fr;
		grid-template-areas:
			"calendar projects"
			"calendar tasks";
		gap: var(--size-4-8);
		height: 100%;
		padding: var(--size-4-4);
		background: var(--background-primary);
		overflow: auto;
	}

	::slotted(.calendar-widget) {
		grid-row: 1 / 3;
		grid-area: calendar;
	}

	::slotted(.projects-panel) {
		grid-area: projects;
	}

	::slotted(.tasks-panel) {
		grid-area: tasks;
	}

	@media (max-width: 768px) {
		.layout {
			grid-template-columns: 1fr;
		}

		::slotted(.calendar-widget) {
			grid-row: auto;
		}
	}
</style>
