<?php

/**
 * DynamicDropdown
 *
 * This source file is subject to the GNU General Public License version 3 (GPLv3)
 * For the full copyright and license information, please view the LICENSE.md
 * file distributed with this source code.
 *
 * @category Pimcore
 * @copyright  Copyright (c) 2015 Weblizards GmbH (http://www.weblizards.de)
 * @author     Thomas Keil <thomas@weblizards.de> & Paul Clegg <paul@gatherdigital.co.uk>
 * @license    http://www.pimcore.org/license    GNU General Public License version 3 (GPLv3)
 */


namespace Pimcore\Model\Object\ClassDefinition\Data;

use Pimcore\Model\Object;
use Pimcore\Model\Asset;
use Pimcore\Model\Document;
use Pimcore\Model\Element;

class DynamicDropdown extends Href {

    /**
     * Static type of this element
     *
     * @var string
     */
    public $fieldtype = "dynamicDropdown";

    public $source_parentid;
    public $source_classname;
    public $source_methodname;
    public $source_recursive;
    public $sort_by;

    public function setsource_parentid($id) {
        $this->source_parentid = $id;
    }

    public function getsource_parentid() {
        return $this->source_parentid;
    }

    public function setsource_classname($classname) {
        $this->source_classname = $classname;
    }

    public function getsource_classname() {
        return $this->source_classname;
    }

    public function setsource_methodname($methodname) {
        $this->source_methodname = $methodname;
    }

    public function getsource_methodname() {
        return $this->source_methodname;
    }

    public function setsource_recursive($recursive) {
        $this->source_recursive = $recursive;
    }

    public function getsource_recursive() {
        return $this->source_recursive;
    }

    public function setsort_by($sort_by) {
        $this->sort_by = $sort_by;
    }

    public function getsort_by() {
        return $this->sort_by;
    }


    public function getDataForEditmode($data, $object = null, $params = array()) {
        if ($data instanceof Object\AbstractObject) {
            return $data->getId();
        }

        return null;
    }

    /**
     * @return boolean
     */
    public function getObjectsAllowed() {
        return array("\\Pimcore\\Model\\Object\\".ucfirst($this->source_classname));
    }

    /**
     * @see Object\ClassDefinition\Data::getDataFromEditmode
     * @param array $data
     * @param null|Object\AbstractObject $object
     * @return Asset|Document|Object\AbstractObject
     */
    public function getDataFromEditmode($data, $object = null) {
        return Element\Service::getElementById("object", $data);
    }

}
