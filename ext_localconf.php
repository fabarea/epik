<?php
if (!defined ('TYPO3_MODE')) 	die ('Access denied.');

\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
	$_EXTKEY,
	'Pi1',
	array(
		'Payment' => 'new, show, create, edit, update',
		'Feedback' => 'show',
	),
	// non-cacheable actions
	array(
		'Payment' => 'new, show, create, edit, update',
	)
);

?>
