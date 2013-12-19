<?php
namespace TYPO3\CMS\Epik\ViewHelpers;
/***************************************************************
 *  Copyright notice
 *
 *  (c) 2012-2013 Fabien Udriot <fabien.udriot@typo3.org>
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

/**
 * View helper which returns "Default Amounts" form element.
 */
class DefaultAmountsViewHelper extends \TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper {

	/**
	 * Returns "Default Amounts" form element.
	 *
	 * @param array $settings
	 * @return int
	 */
	public function render(array $settings = array()) {

		$result = '';
		if (!empty($settings['defaultAmounts'])) {

			$rows = preg_split('/\r\n|\r|\n/', $settings['defaultAmounts']);
			$separator = 'checked="checked"';
			foreach ($rows as $row) {
				if (trim($row) != '') {
					$result .= sprintf(
						'<div class="radio-inline"><label><input class="radio " type="radio" value="%s" name="amount" checked="checked" %s/>CHF %s</label></div>',
						$row * 100,
						$separator,
						$row
					);
					$separator = '';
				}
			}
		}

		return $result;
	}
}

?>