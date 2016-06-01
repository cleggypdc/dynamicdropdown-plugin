<?php

/**
 * ItemSelector
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
use Pimcore\Model\Element;

class Itemselector extends Multihref {
    /**
     * Static type of this element
     *
     * @var string
     */
    public $fieldtype = "itemselector";
    public $source_parentid;
    public $source_classname;
    public $source_methodname;
    public $sort_by;

    public function setsource_parentid($id)
    {
        $this->source_parentid = $id;
    }

    public function getsource_parentid()
    {
        return $this->source_parentid;
    }

    public function setsource_classname($classname)
    {
        $this->source_classname = $classname;
    }

    public function getsource_classname()
    {
        return $this->source_classname;
    }

    public function setsource_methodname($methodname)
    {
        $this->source_methodname = $methodname;
    }

    public function getsource_methodname()
    {
        return $this->source_methodname;
    }

    public function setsource_recursive($recursive) {
        $this->source_recursive = $recursive;
    }

    public function getsource_recursive() {
        return $this->source_recursive;
    }

    public function getSort_by() {
        return $this->sort_by;
    }

    public function setSort_by($sort_by) {
        $this->sort_by = $sort_by;
    }

    /**
     * @return boolean
     */
    public function getObjectsAllowed()
    {
        return array("\\Pimcore\\Model\\Object\\" . ucfirst($this->source_classname));
    }

    /**
     * @see Object\ClassDefinition\Data::getDataFromEditmode
     * @param array $data
     * @param null|Object\AbstractObject $object
     * @return array
     */
    public function getDataFromEditmode($data, $object = null, $params = array()) {
        //if not set, return null
        if ($data === null or $data === FALSE) {
            return null;
        }

        $elements = array();
        $data = explode(",",$data);
        if (is_array($data) && count($data) > 0) {
            foreach ($data as $id) {
                $elements[] = Element\Service::getElementById("object", $id);
            }

        }
        //must return array if data shall be set
        return $elements;
    }

    /**
     * @see Object\ClassDefinition\Data::getDataForEditmode
     * @param array $data
     * @param null|Object\AbstractObject $object
     * @return array
     */
    public function getDataForEditmode($data, $object = null, $params = array()) {
        $return = array();

        if (is_array($data) && count($data) > 0) {
            foreach ($data as $element) {
                $return[] = $element->geto_id();
            }
            return implode(",", $return);
        }

        return false;
    }
}
