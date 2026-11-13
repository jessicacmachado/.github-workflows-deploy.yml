import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  ChakraProvider,
  Collapse,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react'

const initialReagents = [
  'Ácido Clorídrico (HCl)',
  'Ácido Sulfúrico (H2SO4)',
  'Ácido Nítrico (HNO3)',
  'Ácido Acético (CH3COOH)',
  'Hidróxido de Sódio (NaOH)',
  'Hidróxido de Amônio (NH4OH)',
  'Hidróxido de Cálcio (Ca(OH)2)',
  'Bicarbonato de Sódio (NaHCO3)',
  'Cloreto de Sódio (NaCl)',
  'Sulfato de Cobre II (CuSO4)',
  'Nitrato de Prata (AgNO3)',
  'Cloreto de Bário (BaCl2)',
  'Carbonato de Sódio (Na2CO3)',
  'Permanganato de Potássio (KMnO4)',
  'Iodeto de Potássio (KI)',
  'Cromato de Potássio (K2CrO4)',
  'Água Destilada/Deionizada (H2O)',
  'Álcool Etílico/Etanol (C2H5OH)',
  'Acetona (CH3COCH3)',
  'Hexano (C6H14)',
  'Fenolftaleína',
  'Metiloranje (Alaranjado de Metila)',
  'Azul de Bromotimol',
  'Solução de Amido',
  'Peróxido de Hidrogênio (H2O2)',
  'Glicerina/Glicerol',
  'Ácido Ascórbico',
  'Sulfato de Magnésio (MgSO4) Anidro',
  'Glicose (C6H12O6)',
  'Nitrato de Amônio (NH4NO3)',
].map((name, index) => ({ id: index + 1, name: `${index + 1}. ${name}`, quantity: 2 }))

const formatQuantity = (quantity) =>
  quantity.toLocaleString('pt-BR', { maximumFractionDigits: 3 })

function InventoryApp() {
  const [reagents, setReagents] = useState(initialReagents)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [quantity, setQuantity] = useState('')
  const [newName, setNewName] = useState('')
  const [showReagentList, setShowReagentList] = useState(false)
  const [logName, setLogName] = useState('')
  const [activityLog, setActivityLog] = useState([])
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const toast = useToast()

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const addLogEntry = (action) => {
    setActivityLog((entries) => [{
      id: `${Date.now()}-${Math.random()}`,
      name: logName.trim() || 'Usuário não identificado',
      action,
      time: new Date().toLocaleString('pt-BR'),
    }, ...entries])
  }

  const filteredReagents = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR')
    return reagents.filter((reagent) => reagent.name.toLocaleLowerCase('pt-BR').includes(term))
  }, [reagents, search])

  const selectedReagent = reagents.find((reagent) => reagent.id === selectedId)
  const totalUnits = reagents.reduce((sum, reagent) => sum + reagent.quantity, 0)

  const showMessage = (title, status = 'success', description) => {
    toast({ title, description, status, duration: 3000, isClosable: true, position: 'top-right' })
  }

  const moveStock = (direction) => {
    if (!selectedReagent) {
      showMessage('Selecione um reagente na tabela.', 'warning')
      return
    }

    const amount = Number(quantity)
    if (!Number.isFinite(amount) || amount <= 0) {
      showMessage('Informe uma quantidade válida maior que zero.', 'error')
      return
    }
    if (direction < 0 && amount > selectedReagent.quantity) {
      showMessage(`Estoque insuficiente. Disponível: ${formatQuantity(selectedReagent.quantity)}.`, 'error')
      return
    }

    setReagents((current) => current.map((reagent) =>
      reagent.id === selectedId
        ? { ...reagent, quantity: Math.max(0, reagent.quantity + direction * amount) }
        : reagent,
    ))
    setQuantity('')
    addLogEntry(`${direction < 0 ? 'Retirada' : 'Reposição'} de ${formatQuantity(amount)} unidade(s) de ${selectedReagent.name}.`)
    showMessage(direction < 0 ? 'Retirada registrada.' : 'Reposição registrada.')
  }

  const addReagent = (event) => {
    event.preventDefault()
    const cleanName = newName.trim()
    if (!cleanName) {
      showMessage('Digite o nome do reagente.', 'warning')
      return
    }
    const duplicate = reagents.some((reagent) => {
      const existingName = reagent.name.replace(/^\d+\.\s*/, '').trim()
      return existingName.toLocaleLowerCase('pt-BR') === cleanName.toLocaleLowerCase('pt-BR')
    })
    if (duplicate) {
      showMessage('Esse reagente já está cadastrado.', 'warning')
      return
    }

    const id = Math.max(0, ...reagents.map((reagent) => reagent.id)) + 1
    setReagents((current) => [...current, { id, name: `${id}. ${cleanName}`, quantity: 2 }])
    addLogEntry(`Cadastro do reagente ${id}. ${cleanName} com 2 unidades.`)
    setNewName('')
    showMessage('Reagente cadastrado com 2 unidades.')
  }

  return (
    <Box minH="100vh" bg="gray.50" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
      <Box maxW="1200px" mx="auto">
        <Text fontWeight="bold" textAlign="center" color="gray.600" mb={5}>
          Carl Sagan: “Em algum lugar, alguma coisa incrível está esperando para ser descoberta.”
        </Text>
        <Flex align="center" justify="space-between" gap={4} mb={8} wrap="wrap">
          <Box>
            <Text color="teal.600" fontWeight="bold" fontSize="sm" letterSpacing="wide">
              LABORATÓRIO · CONTROLE DE ESTOQUE
            </Text>
            <Heading mt={1} size={{ base: 'lg', md: 'xl' }} color="gray.800">
              🔬 LabInv — Reagentes
            </Heading>
            <Text color="gray.600" mt={2}>Gerencie entradas e saídas do inventário.</Text>
          </Box>
          <HStack spacing={6} bg="white" borderWidth="1px" borderColor="gray.200" rounded="xl" px={5} py={3}>
            <Box>
              <Text fontSize="sm" color="gray.500">Horário</Text>
              <Text fontSize="xl" fontWeight="bold" color="teal.700" fontVariantNumeric="tabular-nums">
                {currentTime.toLocaleTimeString('pt-BR')}
              </Text>
            </Box>
            <Divider orientation="vertical" h="10" />
            <HStack spacing={3}>
              <Text fontSize="2xl" aria-hidden="true">🧪</Text>
              <Box>
                <Text fontSize="sm" color="gray.500">Reagentes cadastrados</Text>
                <Text fontSize="xl" fontWeight="bold" color="teal.700">{reagents.length}</Text>
              </Box>
            </HStack>
          </HStack>
        </Flex>

        <Tabs variant="enclosed" colorScheme="teal" isLazy>
          <TabList mb={4}>
            <Tab>📦 Estoque</Tab>
            <Tab>🔗 Fornecedor Sigma</Tab>
            <Tab>📝 Log do programa</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0} py={2}>
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} alignItems="start">
          <Box gridColumn={{ base: 'auto', lg: 'span 2' }} bg="white" borderWidth="1px" borderColor="gray.200" rounded="xl" overflow="hidden">
            <Box px={5} py={4}>
              <Flex justify="space-between" align="center" gap={4} wrap="wrap">
                <Box>
                  <Heading size="md" color="gray.800">Inventário disponível</Heading>
                  <Text color="gray.500" fontSize="sm" mt={1}>Abra a lista para selecionar um reagente e movimentar o saldo.</Text>
                  <Button
                    size="sm"
                    mt={3}
                    variant="outline"
                    colorScheme="teal"
                    onClick={() => setShowReagentList((visible) => !visible)}
                    aria-expanded={showReagentList}
                  >
                    {showReagentList ? 'Ocultar lista' : 'Mostrar lista de reagentes'}
                  </Button>
                </Box>
                <InputGroup maxW={{ base: '100%', sm: '280px' }}>
                  <InputLeftElement pointerEvents="none" color="gray.400">⌕</InputLeftElement>
                  <Input
                    aria-label="Buscar reagente"
                    placeholder="Buscar reagente..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </InputGroup>
              </Flex>
            </Box>
            <Collapse in={showReagentList} animateOpacity>
            <Divider />
            <TableContainer maxH="560px" overflowY="auto">
              <Table size="sm" variant="simple">
                <Thead position="sticky" top={0} zIndex={1} bg="gray.50">
                  <Tr>
                    <Th py={3}>Reagente / fórmula química</Th>
                    <Th isNumeric py={3} width="120px">Quantidade</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredReagents.map((reagent) => {
                    const selected = selectedId === reagent.id
                    return (
                      <Tr
                        key={reagent.id}
                        onClick={() => setSelectedId(reagent.id)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') setSelectedId(reagent.id)
                        }}
                        tabIndex={0}
                        role="button"
                        aria-pressed={selected}
                        cursor="pointer"
                        bg={selected ? 'teal.50' : undefined}
                        _hover={{ bg: selected ? 'teal.50' : 'gray.50' }}
                      >
                        <Td py={3} whiteSpace="normal">{reagent.name}</Td>
                        <Td isNumeric py={3}>
                          <Badge colorScheme={reagent.quantity === 0 ? 'red' : 'teal'}>{formatQuantity(reagent.quantity)}</Badge>
                        </Td>
                      </Tr>
                    )
                  })}
                  {filteredReagents.length === 0 && (
                    <Tr><Td colSpan={2} textAlign="center" py={10} color="gray.500">Nenhum reagente encontrado.</Td></Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
            <Flex px={5} py={3} borderTopWidth="1px" borderColor="gray.100" justify="space-between" gap={3} wrap="wrap">
              <Text fontSize="sm" color="gray.500">Exibindo {filteredReagents.length} de {reagents.length} reagentes</Text>
              <Text fontSize="sm" fontWeight="semibold" color="gray.600">Total em estoque: {formatQuantity(totalUnits)} unidades</Text>
            </Flex>
            </Collapse>
          </Box>

          <VStack spacing={6} align="stretch">
            <Box bg="white" borderWidth="1px" borderColor="gray.200" rounded="xl" p={5}>
              <Heading size="md" mb={1}>Movimentar estoque</Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                {selectedReagent ? `Selecionado: ${selectedReagent.name}` : 'Selecione um item na tabela.'}
              </Text>
              {selectedReagent && (
                <Alert status="info" rounded="md" mb={4} py={2}>
                  <AlertIcon />Saldo atual: <strong>{formatQuantity(selectedReagent.quantity)}</strong>
                </Alert>
              )}
              <FormControl>
                <FormLabel fontSize="sm">Quantidade</FormLabel>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Ex.: 1,5"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                />
              </FormControl>
              <Stack mt={4} spacing={3}>
                <Button colorScheme="red" variant="outline" onClick={() => moveStock(-1)}>↓ Retirar do estoque</Button>
                <Button colorScheme="green" onClick={() => moveStock(1)}>↑ Devolver / repor</Button>
              </Stack>
            </Box>

            <Box as="form" onSubmit={addReagent} bg="white" borderWidth="1px" borderColor="gray.200" rounded="xl" p={5}>
              <Heading size="md" mb={1}>Cadastrar reagente</Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>O novo item será adicionado com 2 unidades.</Text>
              <FormControl>
                <FormLabel fontSize="sm">Nome e fórmula química</FormLabel>
                <Input
                  placeholder="Ex.: Cloreto de Potássio (KCl)"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                />
              </FormControl>
              <Button type="submit" colorScheme="teal" width="full" mt={4}>＋ Adicionar reagente</Button>
            </Box>
          </VStack>
        </SimpleGrid>
            </TabPanel>
            <TabPanel>
              <Box bg="white" borderWidth="1px" borderColor="gray.200" rounded="xl" p={6}>
                <Heading size="md" mb={2}>Fornecedor de referência</Heading>
                <Text color="gray.600" mb={4}>
                  Consulte o catálogo e as informações de produtos diretamente no site oficial da Sigma-Aldrich.
                </Text>
                <Button as={Link} href="https://www.sigmaaldrich.com/deepweb/assets/sigmaaldrich/marketing/global/documents/343/785/supersaversale-2025-sg-mk.pdf" isExternal colorScheme="teal">
                  Acessar catálogo da Sigma-Aldrich ↗
                </Button>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box bg="white" borderWidth="1px" borderColor="gray.200" rounded="xl" p={6}>
                <Heading size="md" mb={2}>Log do programa</Heading>
                <Text color="gray.600" fontSize="sm" mb={4}>
                  Informe seu nome para identificar as próximas ações registradas.
                </Text>
                <FormControl maxW="md" mb={6}>
                  <FormLabel>Nome para o log</FormLabel>
                  <Input
                    placeholder="Ex.: Maria Silva"
                    value={logName}
                    onChange={(event) => setLogName(event.target.value)}
                  />
                </FormControl>
                <Heading size="sm" mb={3}>Atividades recentes</Heading>
                {activityLog.length === 0 ? (
                  <Text color="gray.500">Nenhuma atividade registrada nesta sessão.</Text>
                ) : (
                  <Stack spacing={3}>
                    {activityLog.map((entry) => (
                      <Box key={entry.id} borderWidth="1px" borderColor="gray.100" rounded="md" p={3}>
                        <Text fontWeight="semibold">{entry.action}</Text>
                        <Text fontSize="sm" color="gray.500">{entry.name} · {entry.time}</Text>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Text textAlign="center" color="gray.500" fontSize="sm" mt={8}>LabInv · Gestão integrada de estoque</Text>
      </Box>
    </Box>
  )
}

export default function App() {
  return (
    <ChakraProvider>
      <InventoryApp />
    </ChakraProvider>
  )
}
