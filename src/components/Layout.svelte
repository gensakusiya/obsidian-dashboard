<div class="layout">
	<slot name="calendar"></slot>
	<slot name="projects"></slot>
	<slot name="fleeting-notes"></slot>
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1.5fr 1fr;
		gap: var(--size-4-4);
		height: 100%;
		padding: var(--size-4-4);
		background: var(--background-primary);
		color: var(--text-normal);
		overflow: hidden;
	}

	::slotted(.calendar-widget) {
		grid-column: 1;
		grid-row: 1 / 3;
		min-height: 0;
		overflow: hidden;
	}

	::slotted(.projects-panel) {
		grid-column: 2;
		grid-row: 1;
		min-height: 0;
		overflow: hidden;
	}

	::slotted(.fleeting-notes-panel) {
		grid-column: 2;
		grid-row: 2;
		min-height: 0;
		overflow: hidden;
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
