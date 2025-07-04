import cliProgress from 'cli-progress';

// Create a new progress bar instance
const b1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

// Start the progress bar with a total value and initial value
const totalItems = 100;
b1.start(totalItems, 0);

// Simulate some work
for (let i = 0; i < totalItems; i++) {
    // Update the current value
    b1.update(i + 1);
    // Simulate work time
    //sleep(50000); // Sleep for 50ms
}

// Stop the progress bar
b1.stop();

console.log('Done!');
